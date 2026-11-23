import React from 'react';
import { Lock, PhoneCall, ShieldCheck, Users, X } from 'lucide-react';

interface HelpPrivacyModalProps {
  onClose: () => void;
}

export function HelpPrivacyModal({ onClose }: HelpPrivacyModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#232B38]/55 p-4 overflow-y-auto"
    >
      <div className="my-auto w-full max-w-xl rounded-2xl border border-[#DDD4C2] bg-[#FFFDF9] p-6 shadow-xl sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-[#ECE6D8] pb-3.5">
          <div>
            <h2
              id="help-modal-title"
              className="font-display text-2xl font-bold text-[#232B38]"
            >
              Aide 3018 & Protection de la vie privée
            </h2>
            <p className="mt-0.5 text-xs text-[#606A78]">
              Tu n’es jamais seul face au harcèlement scolaire.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre d’aide et vie privée"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDD4C2] bg-white text-[#525B6B] hover:bg-[#FAF7F0] hover:text-[#232B38] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* 3018 Official Helpline Card */}
          <section className="rounded-xl border border-[#A7D8C5] bg-[#ECF8F3] p-4">
            <div className="flex items-start gap-3">
              <PhoneCall className="mt-0.5 h-5 w-5 shrink-0 text-[#1E7F5C]" aria-hidden="true" />
              <div>
                <h3 className="text-base font-bold text-[#14583F]">
                  Appeler ou écrire au 3018 (France)
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#1F4A39]">
                  Numéro national <strong>gratuit, anonyme et confidentiel</strong> contre le harcèlement scolaire et le cyberharcèlement, ouvert 7 jours sur 7 de 9h à 23h (téléphone et application 3018).
                </p>
                <p className="mt-1.5 text-xs text-[#2B5D49]">
                  Des professionnels écoutent les victimes, les témoins et les parents, et peuvent faire supprimer rapidement des contenus blessants en ligne.
                </p>
              </div>
            </div>
          </section>

          {/* School Trusted Adults */}
          <section className="rounded-xl border border-[#E5DEC9] bg-[#FAF7F0] p-4">
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-[#2E66B8]" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-bold text-[#232B38]">
                  À qui parler dans ton école ou ton collège ?
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#4B5565]">
                  Tes parents, ton enseignant ou professeur principal, le CPE, l’infirmière scolaire, le directeur, un surveillant ou le psychologue scolaire. Parler pour protéger quelqu’un n’est jamais « rapporter ».
                </p>
              </div>
            </div>
          </section>

          {/* Privacy Guarantee */}
          <section className="rounded-xl border border-[#E5DEC9] bg-white p-4">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#6D46A8]" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-bold text-[#232B38]">
                  Sécurité & vie privée des mineurs dans ce jeu
                </h3>
                <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-[#4B5565]">
                  <li className="flex items-start gap-1.5">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1E7F5C]" aria-hidden="true" />
                    <span>Aucun compte, aucun e-mail et aucune donnée personnelle enregistrée ou envoyée en ligne.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1E7F5C]" aria-hidden="true" />
                    <span>Pseudos d’animaux totems anonymes et messages d’encouragement pré-écrits positifs (zéro chat libre).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1E7F5C]" aria-hidden="true" />
                    <span>Contenus strictement adaptés aux 6–15 ans, sans harcèlement sexuel ni publicité.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-xl bg-[#232B38] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1E7F5C] cursor-pointer"
          >
            J’ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
