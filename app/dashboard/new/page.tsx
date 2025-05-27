"use client";

import { MessageSquarePlus } from "lucide-react";
import { LukeButton } from "@/components/luke-button";

export default function NewChatPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="space-y-8">
        <div className="bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
          <MessageSquarePlus className="h-12 w-12 text-primary" />
          <h2 className="text-xl font-semibold">Start a New Conversation</h2>
          <p className="text-muted-foreground">
            Begin a fresh conversation with Luke about your business challenges.
          </p>
          <LukeButton />
        </div>
      </div>
    </div>
  );
}
