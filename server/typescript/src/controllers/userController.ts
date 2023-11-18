import bcrypt from "bcrypt";
import { type Response , type Request, Router } from "express";
import db from "../db";

const router = Router();
const saltRounds: number = 10;

router.post("/register", (req: Request, res: Response) => {
    const response: any = {
        "results": [],
        "error": {}
    };

    bcrypt.hash(req.body.password, saltRounds).then(async (hashedPassword: string) => {
        const queryStatement: string = "INSERT INTO users (email, hashedPassword) VALUES ($1, $2) RETURNING userId, email";
        const values = [req.body.email, hashedPassword];
        db.query(queryStatement, values, (err, queryResult) => {
            if (err) {
                console.log(err);
                response["error"] = err;
                res.json(response);
            } else {
                console.log(queryResult["rows"]);
                response.results = queryResult["rows"];
            }
            res.json(response);
        });
    });
});

router.post("/login",  (req: Request, res: Response) => {
    const response: any = {
        "results": [],
        "error": {}
    };

    const queryStatement: string = "SELECT * FROM users WHERE email = $1";
    const values = [req.body.email]

    db.query(queryStatement, values, (err, queryResults: any) => {
        if (err) {
            console.log(err);
            response["error"] = err;
            res.json(response);
            return
        }

        if (queryResults["rows"].length !== 1) {
            response["error"] = {"message" : "Invalid email"};
            res.json(response)
            return
        }

        bcrypt.compare(req.body.password, queryResults["rows"][0]["hashedpassword"], (compareError: Error | undefined, passwordsMatch: boolean) => {
            if (compareError) {
                response.error = compareError;
            }
            else if (passwordsMatch) {
                response.results = [
                        {   
                            "userId": queryResults["rows"][0]["userid"],
                            "email": queryResults["rows"][0]["email"],
                        }
                    ];
                }
            else {
                response.error = {
                    "message": "Invalid password"
                };
            };
            res.json(response);    
        });
    });
});

export default router;
