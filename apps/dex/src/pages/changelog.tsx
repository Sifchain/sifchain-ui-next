import React from "react";
import ReactMarkdown from "react-markdown";
import useChangelogQuery from "~/hooks/useChangelogQuery";
import PageLayout from "~/layouts/PageLayout";

const ChangelogPage = () => {
  const {
    data: changelogRes,
    isLoading,
    isSuccess,
    error,
  } = useChangelogQuery();

  return (
    <PageLayout heading="Changelog">
      <>
        {isLoading && <div>Loading...</div>}
        {isSuccess && (
          <ReactMarkdown className="prose dark:prose-invert prose-sm max-h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar">
            {changelogRes ?? ""}
          </ReactMarkdown>
        )}
        {error && (
          <div>
            {error instanceof Error ? error.message : "Something went wrong"}
          </div>
        )}
      </>
    </PageLayout>
  );
};

export default ChangelogPage;
