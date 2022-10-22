import type { Result } from "$lib/types";
import { EMAIL_SERVER, EMAIL_USER, EMAIL_USERKEY } from "$env/static/private";

interface SendMail  {
        fromEmail: string,
        fromName: string,
        toEmail: string, 
        toName: string, 
        subject: string, 
        text: string, 
        html: string, 
        customID: string
}

export async function sendMail({
        fromEmail,
        fromName,
        toEmail,
        toName,
        subject,
        text,
        html,
        customID
    }: SendMail) {
    const out: Result = {}

    const response = await fetch(
        EMAIL_SERVER,
        {
            method: "POST",
            headers: new Headers({
                "Authorization": 'Basic ' + 
                    Buffer.from(EMAIL_USER + ":" + EMAIL_USERKEY, 'utf-8').toString('base64'),
                //"Authorization": `Basic ${base64.encode(`${EMAIL_USER}:${EMAIL_USERKEY}`)}`,
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({"Messages": [
                {
                "From": {
                    "Email": fromEmail,
                    "Name": fromName,
                },
                "To": [
                    {
                    "Email": toEmail,
                    "Name": toName,
                    }
                ],
                "Subject": subject,
                "TextPart": text,
                "HTMLPart": html,
                "CustomID": customID
                }
            ]})
        }
    )

    if (!response.ok) {
        out.err = "E-mail sending failure: " + response.statusText
        return out
    }

    try {
        const data = await response.json()
        out.res = data
    } catch (error) {
        out.err = "E-mail result parsing failure: " + String(error)
        return out
    }

    //console.log(data)
    
    return out

}