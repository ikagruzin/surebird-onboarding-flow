import { MessageCircle } from "lucide-react";
import tacoAvatar from "@/assets/taco-avatar.jpg";

const AskTacoFloat = () => (
  <div className="fixed bottom-24 left-6 z-40 hidden lg:block">
    <div className="bg-card border border-border rounded-xl p-4 shadow-lg w-56">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={tacoAvatar}
          alt="Taco"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-foreground">Ask Taco</p>
          <p className="text-xs text-muted-foreground">I'm ready to assist you</p>
        </div>
      </div>
      <button className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
        <MessageCircle className="w-4 h-4 text-success" />
        Chat via WhatsApp
      </button>
    </div>
  </div>
);

export default AskTacoFloat;
