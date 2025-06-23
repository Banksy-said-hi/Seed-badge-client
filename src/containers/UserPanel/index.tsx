import { Card } from "../../components/Card";
import { ContentLoading } from "../../components/ContentLoading";
import { useWeb3 } from "../../hooks/useWeb3";

export function UserPanel() {
  const { account, chain, tokenBalance } = useWeb3();

  return (
    <Card title="User Panel">
      <ContentLoading isLoading={!account}>
        <div>
          <p>Smart Account: {account?.smartAccount}</p>
          <p>External Account: {account?.externalAccount}</p>
        </div>
      </ContentLoading>
      <ContentLoading isLoading={!chain}>
        <p>Connected Network: {chain}</p>
      </ContentLoading>
      <ContentLoading isLoading={!tokenBalance}>
        <p>Token Balance: {tokenBalance}</p>
      </ContentLoading>
    </Card>
  );
}
