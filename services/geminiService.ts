import { GoogleGenAI } from "@google/genai";
import { Appointment } from "../domain/types";

// Obtener la API key desde las variables de entorno de Vite
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || "";
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getNoShowPrediction = async (
  appointment: Appointment,
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "API Key no configurada.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analiza la probabilidad de que el paciente con ID ${appointment.clientId} asista a su cita de servicio con ID ${appointment.serviceId} el día ${appointment.date} a las ${appointment.startTime}. 
      Históricamente, este tipo de servicio tiene un 15% de cancelaciones. 
      Genera una recomendación de 2 líneas para el profesional para asegurar la asistencia.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    return response.text || "No se pudo generar predicción.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con la IA.";
  }
};

export const getBusinessInsights = async (
  tenantName: string,
  metrics: any,
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "Configura la API Key para obtener insights.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Eres un consultor experto en negocios. El negocio ${tenantName} tiene las siguientes métricas: ${JSON.stringify(metrics)}. 
      Proporciona 3 consejos estratégicos breves para aumentar las reservas y reducir cancelaciones. Responde en español.`,
    });
    return response.text || "Sin insights disponibles.";
  } catch (error) {
    return "Error al generar insights de negocio.";
  }
};
