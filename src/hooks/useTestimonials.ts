/**
 * Reads client testimonials that carry recorded consent.
 *
 * The consent gate is in the database, not here: `publishable_testimonials`
 * exposes only rows where `permission = 'free'`, and only the fields needed to
 * render a quote. Doing it that way means a mistake in this file cannot publish
 * something unconsented, and it means the same rule applies to anything else
 * that ever reads this data.
 *
 * If nothing has consent recorded, this returns nothing and the calling
 * component renders nothing. That is the correct outcome, not an error state.
 * Publishing a client quote without a recorded sign-off is the failure mode
 * worth designing against, and an empty section is a cheap price for it.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PublishableTestimonial {
  id: string;
  role: string | null;
  company: string | null;
  summary_line: string;
  rating: number | null;
}

export function useTestimonials() {
  return useQuery<PublishableTestimonial[]>({
    queryKey: ["publishable-testimonials"],
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      // `publishable_testimonials` is a view added in a later migration than
      // the checked-in generated types, so it is not in the Database union.
      // Casting here rather than hand-editing the generated file, which would
      // be overwritten the next time types are regenerated.
      const { data, error } = await (
        supabase as unknown as {
          from: (t: string) => {
            select: (c: string) => {
              order: (
                c: string,
                o: { ascending: boolean },
              ) => Promise<{ data: PublishableTestimonial[] | null; error: unknown }>;
            };
          };
        }
      )
        .from("publishable_testimonials")
        .select("id, role, company, summary_line, rating")
        .order("created_at", { ascending: false });

      // A missing view or a denied read is not worth breaking a page over.
      // Render nothing and move on; the rest of the proof on the page is
      // static and does not depend on this.
      if (error) return [];
      return (data ?? []) as PublishableTestimonial[];
    },
  });
}
