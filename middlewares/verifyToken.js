const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  // Asegúrate de que el token esté en el formato correcto
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado, formato de token inválido" });
  }

  // Extrae el token eliminando "Bearer " al principio
  const token = authHeader.split(" ")[1];
  console.log("Token recibido:", token);  // Verifica que el token completo se haya recibido
  
  if (!token) {
    return res.status(401).json({ message: "No autorizado, se requiere token" });
  }

  try {
    // Verifica el token con la misma clave usada para firmar
    const decoded = jwt.verify(token, "az_AZ");
    console.log("Token válido:", decoded);  // Verifica si el token es válido
    req.user = decoded;  // Almacena el payload del token en el objeto de la solicitud
    next();  // Continúa al siguiente middleware o controlador
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = verifyToken;
