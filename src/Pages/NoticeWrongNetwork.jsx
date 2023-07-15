function NoticeWrongNetwork() {
  return (
    <p>
      ⚠️ MetaMask is not connected to the same network as the required, please connect to Shardeum dapp network.
      chainId: 8081,<br />
      chainName: Shardeum dapp network,<br />
      symbol: SHM,<br />
      rpcUrls: [https://dapps.shardeum.org/]<br/>
    </p>
  );
}

export default NoticeWrongNetwork;
