
import { GoogleGenAI, Type } from "@google/genai";
// Fixed: Using Appointment from domain/types to match professional dashboard data structures
import { Appointment } from "../domain/types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fixed: Updated signature to accept domain Appointment type and adjusted prompt fields
export const getNoShowPrediction = async (appointment: Appointment): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza la probabilidad de que el paciente con ID ${appointment.clientId} asista a su cita de servicio con ID ${appointment.serviceId} el día ${appointment.date} a las ${appointment.startTime}. 
      Históricamente, este tipo de servicio tiene un 15% de cancelaciones. 
      Genera una recomendación de 2 líneas para el profesional para asegurar la asistencia.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Accessing .text property directly as per Gemini API guidelines
    return response.text || "No se pudo generar predicción.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con la IA.";
  }
};

export const getBusinessInsights = async (tenantName: string, metrics: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un consultor experto en negocios. El negocio ${tenantName} tiene las siguientes métricas: ${JSON.stringify(metrics)}. 
      Proporciona 3 consejos estratégicos breves para aumentar las reservas y reducir cancelaciones. Responde en español.`,
    });
    // Accessing .text property directly as per Gemini API guidelines
    return response.text || "Sin insights disponibles.";
  } catch (error) {
    return "Error al generar insights de negocio.";
  }
};
