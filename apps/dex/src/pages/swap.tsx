import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

import { Button, toast } from "@sifchain/ui";

const SwapPage = () => {
  return (
    <PageLayout heading="Swap" title="Swap">
      Swap Page
      <Button
        onClick={() => {
          toast.success?.("Success");
        }}
      >
        fire toast
      </Button>
    </PageLayout>
  );
};

export default SwapPage;
