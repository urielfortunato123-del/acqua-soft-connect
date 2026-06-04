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

export const IMMOBILE_TYPES = [
  "Casa",
  "Apartamento",
  "Comercial",
  "Outro"
];

export const PEOPLE_QUANTITY = [
  "1 a 2 pessoas",
  "3 a 5 pessoas",
  "Mais de 5 pessoas"
];

export const INTERESTS = [
  "Água gelada",
  "Água natural",
  "Água gelada e natural",
  "Não sei qual modelo escolher"
];

export function formatWhatsAppMessage(data: any) {
  const isVenda = data.adquirido_anteriormente === false;
  
  let message = `*NOVO ATENDIMENTO ACQUA SOFT*\n`;
  message += `*Fluxo:* ${isVenda ? 'Venda (Novo Cliente)' : 'Suporte (Já é Cliente)'}\n\n`;
  
  message += `*DADOS DO CLIENTE*\n`;
  message += `*Nome:* ${data.nome}\n`;
  message += `*Telefone:* ${data.telefone}\n`;
  message += `*Cidade:* ${data.cidade}\n`;
  message += `*Bairro:* ${data.bairro}\n`;
  
  if (isVenda) {
    message += `\n*DADOS PARA ORÇAMENTO*\n`;
    message += `*Tipo de imóvel:* ${data.tipo_imovel}\n`;
    message += `*Qtd. pessoas:* ${data.qtd_pessoas}\n`;
    message += `*Interesse:* ${data.interesse}\n`;
  } else {
    message += `\n*DADOS DO EQUIPAMENTO*\n`;
    message += `*Modelo:* ${data.modelo_purificador === 'Outro' ? data.modelo_outro : data.modelo_purificador}\n`;
    message += `*Problema/Solicitação:* ${data.descricao}\n`;
  }
  
  if (data.maps_link) {
    message += `\n*Localização:* ${data.maps_link}\n`;
  }
  
  return encodeURIComponent(message);
}
