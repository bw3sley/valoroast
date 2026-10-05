import { ChallengeFriendDialog } from "@/components/challenge-friend-dialog";
import { DeleteRoastDialog } from "@/components/delete-roast-dialog";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RoastFlowProvider } from "@/contexts/roast-flow-context";

export default function RoastsLayout({ children }: LayoutProps<"/">) {
  return (
    <RoastFlowProvider>
      <div className="relative flex min-h-screen flex-1 flex-col overflow-x-hidden">
        <Header />
        {children}
        <Footer />
      </div>

      <ChallengeFriendDialog />
      <DeleteRoastDialog />
    </RoastFlowProvider>
  );
}
