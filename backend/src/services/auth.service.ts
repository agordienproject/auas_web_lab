import express from "express";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismaPSQL } from "../prisma/client_psql";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const PORT = process.env.PORT_SERVEUR || 3000;
const SALT_ROUNDS = 12;


// ------------------- Fonctions utiles ------------------- //


// ------------------- Fonctions d'authentification ------------------- //


// Fonction de création d'un user //
export const registerUser = async (data: any) => {

    try {
        // Vérification adresse mail
        const existingUser = await prismaPSQL.dIM_USER.findFirst({
            where: { email: data.email },
        });
        if (existingUser) throw new Error("Email déjà utilisé.");

        // Récupération du role de l'user
        data.role = "inspector";

        // Hashage du mot de passe
        const hashedPassword = bcrypt.hashSync(data.password, SALT_ROUNDS);

        console.log("Création de l'user...");
        // Création de l'user
        const response = await prismaPSQL.dIM_USER.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                pseudo: data.pseudo,
                email: data.email,
                password: hashedPassword,
                role: data.role,
            },
        });
        if (!response) throw new Error("Erreur lors de la création de l'utilisateur.");
        console.log("User créé: ", response);

        return response;
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        if (error.message === "Email déjà utilisé.") {
            throw new Error("Email déjà utilisé.");
        }
        else {
            throw new Error("Erreur lors de la création de l'utilisateur.");
        }
    }
};

// Fonction d'authentification d'un user //
export const authenticateUser = async (data: any) => {
    const user = await prismaPSQL.dIM_USER.findFirst({
        where: { email: data.email },
    });
    if (!user || !bcrypt.compareSync(data.password, user.password)) {
        throw new Error("Identifiants incorrects.");
    }
    console.log("User: ", user);
    // Vérifier si l'utilisateur est suspendu
    if (user.deleted) {
        throw new Error("Utilisateur supprimé.");
    }

    // Récupérer le nom du role
    const roleName = user.role;
    const token = jwt.sign({ id: user.id_user.toString(), role: roleName }, JWT_SECRET, { expiresIn: "1h" });
    console.log("Token: ", token);
    console.log("Utilisateur connecté: ", user.email);
    return { message: "Connexion réussie", token, id_user: user.id_user, role: roleName };
};
