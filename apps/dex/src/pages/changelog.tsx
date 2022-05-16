import React from "react";
import ReactMarkdown from "react-markdown";
import useChangelogQuery from "~/hooks/useChangelogQuery";
import MainLayout from "~/layouts/MainLayout";
import PageLayout from "~/layouts/PageLayout";

const ChangelogPage = () => {
  const { data: changelogRes, isLoading, isSuccess } = useChangelogQuery();

  return (
    <MainLayout>
      <PageLayout>
        <ReactMarkdown
          className="prose dark:prose-invert"
          children={changelogRes ?? ""}
        />
      </PageLayout>
    </MainLayout>
  );
};

export default ChangelogPage;
