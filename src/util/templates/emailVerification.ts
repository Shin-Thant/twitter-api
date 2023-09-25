export function getEmailVerifyTemplate({
	name,
	verifyLink,
	expireTimeInMins,
}: {
	name: string;
	verifyLink: string;
	expireTimeInMins: number;
}) {
	return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title></title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    padding: 1.5rem;
                    color: #444a5b;
                }
                a:hover {
                    background-color: hsl(203, 100%, 55%) !important;
                }
                a:focus {
                    background-color: hsl(203, 100%, 55%) !important;
                }
            </style>
        </head>
        <body>
            <div style="max-width: 500px; margin: auto">
                <h1 style="text-align: center; color: #0094f0; margin-bottom: 2rem">
                    Email Verification!
                </h1>
                <h4 style="margin-bottom: 1rem">Dear ${name},</h4>
                <p>
                    Thank you for signing up! To ensure the security of your
                    account, we need to verify your email address.
                </p>
                <br />
                <p>
                    To complete the verification process, please click the button
                    below:
                </p>
                <br />
    
                <div
                    style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    "
                >
                    <a
                        href="${verifyLink}"
                        target="_blank"
                        style="
                            width: 150px;
                            padding-top: 12px;
                            padding-bottom: 12px;
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 15px;
                            background-color: #0094f0;
                            border: 0px;
                            outline: 0px;
                            color: white;
                            border-radius: 5px;
                            cursor: pointer;
                            text-align: center;
                            text-decoration: none;
                        "
                    >
                        Verify Email!
                    </a>
                </div>
    
                <br />
                <p style="color: #af0404">
                    Please note that this verification link will expire in
                    ${expireTimeInMins} minutes.
                </p>
    
                <br />
                <p>Best regards,</p>
                <p style="font-weight: bold">The Twitter Team</p>
            </div>
        </body>
    </html>
    `;
}
