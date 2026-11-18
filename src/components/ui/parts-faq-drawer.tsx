import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus } from "lucide-react";
import { CONTACT_EMAIL } from "../../lib/publicLinks";

// Adapted from the supplied FaqDrawer: paper index cards, native disclosures.
// The installed Dialog primitive supplies focus containment, Escape and restoration.
export function PartsFaqDrawer({ heading = false }: { heading?: boolean }) {
  return <Dialog.Root>
    <Dialog.Trigger className={heading ? "parts-faq-heading" : "parts-questions"}>
      {heading ? <>Questions before you start <Plus size={24} aria-hidden="true" /></> : "Questions?"}
    </Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay className="parts-drawer-overlay" />
      <Dialog.Content className="parts-drawer">
        <p className="kit-label">PARTS OF YOUR AI BRAIN</p>
        <Dialog.Title>Questions before you start</Dialog.Title>
        <Dialog.Description className="sr-only">Choose a question to read its answer.</Dialog.Description>
        <Dialog.Close className="parts-drawer-close" aria-label="Close questions"><X aria-hidden="true" /></Dialog.Close>
        <div className="parts-faq-cards">
          <details open><summary>What is an AI brain?</summary><p>Your judgement, written down so AI can use it: your standards, the checks you would make, the questions you would ask. Each part adds one piece of it.</p></details>
          <details><summary>Is a part just a prompt?</summary><p>No. A part is a small piece of working software. It carries rules and checks, written down and tested, so the result is the same on Tuesday as on Monday, and it shows you why it said what it said.</p></details>
          <details><summary>What do I need?</summary><p>Claude Desktop on a Mac or Windows computer. A free Claude account works; a paid plan gives you more room.</p></details>
          <details><summary>Does my data leave my computer?</summary><p>A part of your AI brain runs on your computer with your own Claude. We never see your files, and the part never calls us. Content you share with Claude is processed by Anthropic under your Claude account’s data settings.</p></details>
          <details><summary>What if it does not help?</summary><p>Email us within 14 days for a full refund. No questions. We also check in with you once, personally, and if the part is not working, we run a free session with you to put it right.</p><a href={`mailto:${CONTACT_EMAIL}`}>Email Mindmake</a></details>
          <details><summary>Will you send me emails?</summary><p>Never marketing emails. We use your email to send your download, and to check in with you once, personally, to make sure the part is working. That is all.</p></details>
          <details><summary>Which part should I start with?</summary><p>The one that matches your next decision. Not sure? Try <a href="/who-decided">Who decided?</a>, a free 20-minute audit of one real decision.</p></details>
          <details><summary>Is this the same as working with Mindmake?</summary><p>No. Each part does one job. When you want the whole brain, built around your standards and the decisions you make, that is what we build with you, one to one. <a href="/?start=1">Start here.</a></p></details>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
