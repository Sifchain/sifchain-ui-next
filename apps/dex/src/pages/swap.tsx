import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

import { Button, toast } from "@sifchain/ui";

const SwapPage = () => {
  return (
    <MainLayout title="Swap">
      <PageLayout heading="Swap">
        Swap Page
        <Button
          onClick={() => {
            toast.success?.("Success");
          }}
        >
          fire toast
        </Button>
      </PageLayout>
    </MainLayout>
  );
};

export default SwapPage;
