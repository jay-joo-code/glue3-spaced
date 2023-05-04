import { SENDGRID_API_KEY, SENDGRID_VERIFIED_SENDER } from '$env/static/private';
import sgMail from '@sendgrid/mail';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { to, subject, html } = await request.json();

	sgMail.setApiKey(SENDGRID_API_KEY);

	await sgMail.send({
		to,
		from: SENDGRID_VERIFIED_SENDER,
		subject,
		html
	});

	return json({
		isSent: true
	});
}
