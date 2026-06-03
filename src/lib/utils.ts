import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PURIFIER_MODELS = [
  "Soft Baby",
  "Soft Fit",
  "Soft Slim",
  "Soft Everest",
  "Soft Star",
  "Outro"
];

export const SERVICE_TYPES = {
  ORCAMENTO: "Solicitar Orçamento",
  REFIL: "Troca de Refil",
  SUPORTE: "Suporte Técnico",
  MANUTENCAO: "Manutenção Preventiva"
};

export const PROBLEMS = [
  "Não gela",
  "Vazamento",
  "Não sai água",
  "Água com gosto estranho",
  "Barulho anormal",
  "Troca de peça",
  "Outro"
];

export const MAINTENANCE_PERIODS = [
  "Menos de 6 meses",
  "6 meses",
  "1 ano",
  "Mais de 1 ano"
];

export function formatWhatsAppMessage(data: any) {
  let message = `*NOVO ATENDIMENTO ACQUA SOFT*\n\n`;
  message += `*Tipo:* ${data.tipo}\n`;
  message += `*Nome:* ${data.nome}\n`;
  message += `*Telefone:* ${data.telefone}\n`;
  message += `*Cidade:* ${data.cidade}\n`;
  message += `*Bairro:* ${data.bairro}\n`;
  
  if (data.endereco) message += `*Endereço:* ${data.endereco}\n`;
  
  if (data.modelo_purificador) {
    message += `*Modelo:* ${data.modelo_purificador === 'Outro' ? data.modelo_outro : data.modelo_purificador}\n`;
  }
  
  if (data.problema) {
    message += `*Problema:* ${data.problema === 'Outro' ? data.problema_outro : data.problema}\n`;
  }
  
  if (data.descricao) message += `*Descrição:* ${data.descricao}\n`;
  
  if (data.tipo_imovel) {
    message += `\n*Tipo de imóvel:* ${data.tipo_imovel}\n`;
    if (data.tipo_imovel === 'Apartamento') {
      message += `*Andar:* ${data.andar}\n`;
      message += `*Elevador:* ${data.elevador ? 'Sim' : 'Não'}\n`;
    }
    message += `*Caixa de alta pressão:* ${data.caixa_alta_pressao ? 'Sim' : 'Não'}\n`;
  }
  
  if (data.maps_link) {
    message += `\n*Localização:* ${data.maps_link}\n`;
  }
  
  return encodeURIComponent(message);
}
