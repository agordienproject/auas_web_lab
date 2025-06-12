import { Request, Response } from "express";
import { registerUser, authenticateUser, validateUserAccount, ResendValidateUserAccount } from "../services/auth.service";
import { logConnexion, logUserCreation } from "../services/log.service";
import { subscribeToNotification } from "../services/notification.service";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const convertBigIntToString = (obj: any) => {
    return JSON.parse(JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
    ));
};

export const register = async (req: Request, res: Response) => {
    try {
        const response = await registerUser(req.body);      
        // Récupérer le booléen de notification
        const notification = response.notification;
        if (notification) {
            // Si l'utilisateur a coché la case de notification, on appelle le service de notification
            console.log("L'utilisateur a coché la case de notification");
            // subscribeToNotification(response.id_user, response.id_role);
        }
        console.log("Utilisateur enregistré");
        await logUserCreation(response);
        res.status(201).json(convertBigIntToString(response));
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
        res.status(500).json({ error: error.message });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        console.log("Lancement de la connexion");
        let response = await authenticateUser(req.body);
        response = convertBigIntToString(response);

        const isProduction = process.env.NODE_ENV === 'prod';
        
        // Placer le token dans les cookies
        res.cookie("token", response.token, {
            maxAge: 3600000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        });
        // Rajouter l'ID de l'utilisateur dans le cookie
        res.cookie("userId", response.id_user, {
            maxAge: 3600000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        });
        // Rajouter le rôle de l'utilisateur dans le cookie
        res.cookie("role", response.role, {
            maxAge: 3600000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        });
        console.log("Cookies placés");
        // Enregistrement de la connexion
        await logConnexion(response, req.clientIp);
        console.log("Connexion enregistrée");
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const logout = async (req: Request, res: Response) => {
    try {
        console.log("Déconnexion");
        // Supprimer le cookie
        res.clearCookie('token');
        
        // Dire que la personne est déconnectée
        res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fonction de validation d'un compte
export const validateAccount = async (req: Request, res: Response) => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      res.status(400).send(`
        <html>
          <head>
            <title>Validation échouée</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background-color: #f5f5f5;
              }
              .container {
                text-align: center;
                padding: 2rem;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .button {
                background-color: #39FBA5;
                color: black;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                text-decoration: none;
                margin-top: 1rem;
                display: inline-block;
              }
              .error {
                color: #dc3545;
                margin-bottom: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1 class="error">Validation échouée</h1>
              <p>Le token de validation est manquant ou invalide.</p>
              <a href="${process.env.FRONTEND_URL}/login" class="button">Retour à la page de connexion</a>
            </div>
          </body>
        </html>
      `);
      return;
    }
    try {
        console.log("Validation du compte");
        const response = await validateUserAccount(token);
        res.send(`
          <html>
            <head>
              <title>Compte validé</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f5f5f5;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                  background-color: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .button {
                  background-color: #39FBA5;
                  color: black;
                  padding: 10px 20px;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  text-decoration: none;
                  margin-top: 1rem;
                  display: inline-block;
                }
                .success {
                  color: #28a745;
                  margin-bottom: 1rem;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1 class="success">Compte validé avec succès !</h1>
                <p>Votre compte a été validé. Vous pouvez maintenant vous connecter.</p>
                <a href="${process.env.FRONTEND_URL}/login" class="button">Se connecter</a>
              </div>
            </body>
          </html>
        `);
    } catch (error) {
        console.error("Erreur lors de la validation du compte:", error);
        res.status(500).send(`
          <html>
            <head>
              <title>Erreur de validation</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f5f5f5;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                  background-color: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .button {
                  background-color: #39FBA5;
                  color: black;
                  padding: 10px 20px;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  text-decoration: none;
                  margin-top: 1rem;
                  display: inline-block;
                }
                .error {
                  color: #dc3545;
                  margin-bottom: 1rem;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1 class="error">Erreur lors de la validation</h1>
                <p>Une erreur est survenue lors de la validation de votre compte.</p>
                <a href="${process.env.FRONTEND_URL}/login" class="button">Retour à la page de connexion</a>
              </div>
            </body>
          </html>
        `);
    }
};

// Fonction de renvoi de mail de validation
export const resendValidationAccount = async (req: Request, res: Response) => {
    console.log("Renvoyer le mail de validation");
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "Email manquant." });
        return;
    }
    try {
        console.log("Renvoi de mail de validation");
        const response = await ResendValidateUserAccount(email);
        res.status(200).json({ message: "Mail de validation renvoyé avec succès" });
    } catch (error) {
        console.error("Erreur lors du renvoi du mail de validation:", error);
        res.status(500).json({ error: error.message });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const oldToken = req.cookies.token;
        
        if (!oldToken) {
            res.status(401).json({ error: 'No token provided' });
        }

        try {
            // Verify the old token
            const decoded = jwt.verify(oldToken, JWT_SECRET) as JwtPayload;
            
            // Generate new token
            const newToken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            // Set the new token in cookies
            const isProduction = process.env.NODE_ENV === 'prod';
            res.cookie("token", newToken, {
                maxAge: 3600000,
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax"
            });

            res.status(200).json({
                message: "Token refreshed successfully",
                token: newToken
            });
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

