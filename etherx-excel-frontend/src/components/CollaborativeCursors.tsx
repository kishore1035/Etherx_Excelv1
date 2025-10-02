import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface CollaborativeUser {
  id: string;
  name: string;
  color: string;
  cellId: string;
}

interface CollaborativeCursorsProps {
  users: CollaborativeUser[];
}

export function CollaborativeCursors({ users }: CollaborativeCursorsProps) {
  return (
    <AnimatePresence>
      {users.map((user) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute pointer-events-none z-50"
          style={{
            left: 0,
            top: 0,
          }}
        >
          <div className="flex items-center gap-1">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: user.color }}
            />
            <div
              className="px-2 py-1 rounded text-xs text-white shadow-lg whitespace-nowrap"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// Hook to generate mock collaborative users
export function useMockCollaboration() {
  const [collaborators, setCollaborators] = useState<CollaborativeUser[]>([]);

  useEffect(() => {
    // Simulate random collaborators joining and leaving
    const interval = setInterval(() => {
      const shouldAdd = Math.random() > 0.5;
      
      if (shouldAdd && collaborators.length < 3) {
        const names = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomCol = String.fromCharCode(65 + Math.floor(Math.random() * 10));
        const randomRow = Math.floor(Math.random() * 20) + 1;

        setCollaborators((prev) => {
          if (prev.some((c) => c.name === randomName)) return prev;
          return [
            ...prev,
            {
              id: Math.random().toString(36),
              name: randomName,
              color: randomColor,
              cellId: `${randomCol}${randomRow}`,
            },
          ];
        });
      } else if (collaborators.length > 0) {
        setCollaborators((prev) => prev.slice(1));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [collaborators.length]);

  return collaborators;
}
