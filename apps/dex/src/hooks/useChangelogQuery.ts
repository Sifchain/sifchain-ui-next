import ky from "ky";
import { useQuery } from "react-query";

export default function useChangelogQuery() {
  return useQuery("changelog", async () => {
    const changelogUrl = "https://raw.githubusercontent.com/Sifchain/sifchain-ui/develop/app/CHANGELOG.md";
    try {
      return await ky.get(changelogUrl).text();
    } catch (error) {
      return "";
    }
  });
}
