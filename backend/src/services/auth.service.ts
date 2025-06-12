import express from "express";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { prismaPSQL } from "../prisma/client_psql";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const PORT = process.env.PORT_SERVEUR || 3000;
const SALT_ROUNDS = 10;


// ------------------- Fonctions utiles ------------------- //

// Fonction de récupération de nom de role
export const getRoleName = async (id_role: number) => {
    const role = await prismaPSQL.role.findFirst({
        where: { id_role },
    });
    return role ? role.name : null;
};

// Construction du code de parrainage
export const generateSponsorCode = async () => {
    let newSponsorCode = "";
    while (newSponsorCode == "") {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        const sponsor = await prismaPSQL.user.findFirst({
            where: { sponsor_code: code },
        });
        if (!sponsor) {
            newSponsorCode = code;
        }
    }
    return newSponsorCode;
};

// Fonction d'envoi de mail
export const sendEmail = async (email: string) => {
    const validationToken = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1d' });
    console.log("Token de validation: ", validationToken);
    const link = `http://127.0.0.1:${PORT}/verify?token=${validationToken}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: '"Cesi Eat" <no-reply@cesi-eat.com>',
        to: email,
        subject: "Vérifie ton adresse email",
        html: `<p>Bienvenue ! Clique sur ce lien pour activer ton compte :</p><a href="${link}">Activer mon compte</a>`,
    });
};


// ------------------- Fonctions d'authentification ------------------- //


// Fonction de création d'un user //
export const registerUser = async (data: any) => {

    try {
        // Vérification adresse mail
        const existingUser = await prismaPSQL.user.findFirst({
            where: { email: data.email },
        });
        if (existingUser) throw new Error("Email déjà utilisé.");

        // Récupération du role de l'user
        const roleName = await getRoleName(data.role);
        console.log("Role: ", roleName);

        // Vérification du role (interdiction de créer un user avec un role de 4, 5 ou 6)
        if (!["client", "restaurateur", "livreur", "developpeur"].includes(roleName)) {
            throw new Error("Role invalide.");
        }
        // Vérification du code de parainage
        let idSponsor = null;
        let newSponsorCode = "";
        if (data.sponsorCode && ["client", "restaurateur", "livreur"].includes(roleName)) {
            console.log("Code de parrainage: ", data.sponsorCode);
            const sponsor = await prismaPSQL.user.findFirst({
                where: { sponsor_code: data.sponsorCode },
            });
            if (!sponsor) throw new Error("Code de parrainage invalide.");
            // Construction du code de parrainage

            idSponsor = sponsor.id_user;
        }
        console.log("idSponsor: ", idSponsor);

        if (["client", "restaurateur", "livreur"].includes(roleName)) {
            newSponsorCode = await generateSponsorCode();
            console.log("newSponsorCode: ", newSponsorCode);
        }

        // Si l'user est un dev (id = 4), on lui donne une clé API
        let apiKey = "";
        if (roleName === "developpeur") {
            // Générer un token unique
            try {
                const token = jwt.sign(data.email, JWT_SECRET);
                apiKey = token;
            } catch (error) {
                throw new Error("Erreur lors de la génération de la clé API.");
            }
        }

        // Hashage du mot de passe
        const hashedPassword = bcrypt.hashSync(data.password, SALT_ROUNDS);

        console.log("Création de l'user...");
        // Création de l'user
        const response = await prismaPSQL.user.create({
            data: {
                last_name: data.last_name,
                first_name: data.first_name,
                address: data.address,
                email: data.email,
                city: data.city,
                password: hashedPassword,
                id_role: data.role,
                sponsor_code: newSponsorCode,
                is_sponsored: !!idSponsor,
                id_sponsor: idSponsor,
                notification: true,
                key_api: apiKey,
                available: false,
                suspended: true,
            },
        });
        if (!response) throw new Error("Erreur lors de la création de l'utilisateur.");
        console.log("User créé: ", response);

        // Envoi d'un mail de validation
        await sendEmail(data.email);
        console.log("Mail de validation envoyé à: ", data.email);

        return response;
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        if (error.message === "Email déjà utilisé.") {
            throw new Error("Email déjà utilisé.");
        }
        else if (error.message === "Code de parrainage invalide.") {
            throw new Error("Code de parrainage invalide.");
        }
        else {
            throw new Error("Erreur lors de la création de l'utilisateur.");
        }
    }
};

// Fonction de validation d'un compte utilisateur avec le token en paramètre
export const validateUserAccount = async (token: string) => {
    try {
        // Vérifier si le token est valide
        const payload = jwt.verify(token, JWT_SECRET) as { email: string };
        if (!payload) throw new Error("Token invalide.");
        // Placer le champ suspendu à true
        const updatedUser = await prismaPSQL.user.update({
            where: { email: payload.email },
            data: { suspended: false },
        });
        if (!updatedUser) throw new Error("Erreur lors de la validation du compte.");
        console.log("Compte validé: ", updatedUser);
        return updatedUser;
    } catch (error) {
        console.error("Erreur lors de la validation du compte:", error);
        throw new Error("Erreur lors de la validation du compte.");
    }
};

// Fonction de renvoi de mail de validation
export const ResendValidateUserAccount = async (email: string) => {
    try {
        // Vérifier si l'utilisateur existe
        const user = await prismaPSQL.user.findFirst({
            where: { email },
        });
        if (!user) throw new Error("Utilisateur non trouvé.");
        // Vérifier si l'utilisateur est déjà validé
        if (!user.suspended) throw new Error("Compte déjà validé.");
        // Envoi d'un mail de validation
        await sendEmail(email);
        console.log("Mail de validation envoyé à: ", email);
        return { message: "Mail de validation envoyé." };
    }
    catch (error) {
        console.error("Erreur lors de l'envoi du mail de validation:", error);
        throw new Error("Erreur lors de l'envoi du mail de validation.");
    }
};

// Fonction d'authentification d'un user //
export const authenticateUser = async (data: any) => {
    const user = await prismaPSQL.user.findFirst({
        where: { email: data.email },
    });
    if (!user || !bcrypt.compareSync(data.password, user.password)) {
        throw new Error("Identifiants incorrects.");
    }
    console.log("User: ", user);
    // Vérifier si l'utilisateur est suspendu
    if (user.suspended) {
        throw new Error("Utilisateur suspendu.");
    }

    // Récupérer le nom du role
    const roleName = await getRoleName(user.id_role);
    const token = jwt.sign({ id: user.id_user.toString(), role: roleName }, JWT_SECRET, { expiresIn: "1h" });
    console.log("Token: ", token);
    console.log("Utilisateur connecté: ", user.email);
    return { message: "Connexion réussie", token, id_user: user.id_user, role: roleName };
};
