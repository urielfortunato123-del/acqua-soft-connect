import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function uploadAttachment(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error('Error uploading file:', error.message);
    toast.error(`Falha no upload do arquivo: ${file.name}`);
    return null;
  }
}
