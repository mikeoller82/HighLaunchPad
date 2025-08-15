import { useState, useEffect } from 'react';
import { websiteTemplates, Template } from '../lib/website-templates';
import { enhancedFunnelTemplates, FunnelTemplate } from '../lib/funnel-templates';

export type TemplateType = 'website' | 'funnel';

export function useTemplate(templateType: TemplateType, templateId: string) {
  const [template, setTemplate] = useState<Template | FunnelTemplate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplate() {
      try {
        setLoading(true);
        let selectedTemplate;
        if (templateType === 'website') {
          const templates = await websiteTemplates;
          selectedTemplate = templates.find((t: any) => t.id === templateId);
        } else {
          const templates = await enhancedFunnelTemplates;
          selectedTemplate = templates.find((t: any) => t.id === templateId);
        }
        if (selectedTemplate) {
          setTemplate(selectedTemplate);
        } else {
          setError(`Template with id ${templateId} not found.`);
        }
      } catch (err) {
        setError('Failed to load template.');
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, [templateType, templateId]);

  return { template, loading, error };
}
