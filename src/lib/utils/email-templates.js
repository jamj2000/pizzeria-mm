
export function htmlTemplate({ url, host }) {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = "#ff4d4d"; // Un rojo pizza vibrante
  const backgroundColor = "#f4f4f4";
  const textColor = "#333333";
  const cardBackground = "#ffffff";

  return `
<body style="background: ${backgroundColor}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${backgroundColor}; width: 100% !important; margin: 0 auto;">
    <tr>
      <td align="center">
        <table border="0" cellspacing="0" cellpadding="0" style="background: ${cardBackground}; border-radius: 12px; width: 100%; max-width: 600px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px;">
              <h1 style="color: ${brandColor}; font-size: 28px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Pizzería MM</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 40px 20px 40px; color: ${textColor}; font-size: 18px; line-height: 1.5;">
              ¡Hola! Para entrar a tu cuenta y empezar a pedir las mejores pizzas, haz clic en el botón de abajo.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 40px 40px 40px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 8px;" bgcolor="${brandColor}">
                    <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 14px 30px; border: 1px solid ${brandColor}; display: inline-block; font-weight: bold;">
                      Iniciar Sesión
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 40px 40px 40px; color: #777777; font-size: 14px; line-height: 1.4;">
              Si no solicitaste este correo, puedes ignorarlo con seguridad. Este enlace caducará pronto.
              <br><br>
              Iniciando sesión en <strong>${escapedHost}</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML) */
export function textTemplate({ url, host }) {
  return `Inicia sesión en ${host}\n${url}\n\n`;
}
