import { TechnicalSupportForm } from "../components/forms/TechnicalSupportForm";
import { FilterReplacementForm } from "../components/forms/FilterReplacementForm";
import { RequestQuoteForm } from "../components/forms/RequestQuoteForm";
import { PreventiveMaintenanceForm } from "../components/forms/PreventiveMaintenanceForm";

interface AtendimentoProps {
  tipo: string;
  cliente: string;
}

export default function Atendimento({ tipo }: AtendimentoProps) {
  switch (tipo) {
    case 'suporte':
      return <TechnicalSupportForm />;
    case 'refil':
      return <FilterReplacementForm />;
    case 'orcamento':
      return <RequestQuoteForm />;
    case 'manutencao':
      return <PreventiveMaintenanceForm />;
    default:
      return <TechnicalSupportForm />;
  }
}
