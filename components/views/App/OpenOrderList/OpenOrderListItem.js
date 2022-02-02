import humanizeDuration from "humanize-duration";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { TokenListContext } from "../../../../context/TokenListContext";
import { shortHumanizeDuration } from "../../../../utils/shortHumanizeDuration";

const Container = styled.div`
  padding: 24px;
  border: 2px solid ${({ theme }) => theme.lightGrey};
  border-radius: 6px;

  display: flex;
  justify-content: space-between;
  max-width: 100%;
  align-items: center;

  > div {
    margin-right: 24px;

    &:last-child {
      margin-right: 0;
    }
  }

  &:hover {
    border: 2px solid black;
    cursor: pointer;
  }

  .title {
    font-size: 16px;
  }

  .meta-text {
    font-size: 24px;
    font-weight: bold;
  }

  .assets-list {
    display: grid;
    row-gap: 6px;
    width: 200px;
    height: fit-content;

    .content {
      font-weight: bold;
    }
  }

  .meta-info {
    width: 150px;
    height: 100%;
    max-height: 100px;
    display: grid;
  }

  .images {
    width: 100px;
  }
`;

export const OpenOrderListItem = ({ order }) => {
  const { fetchWrapper, tokenList } = useContext(TokenListContext);
  const [nftImages, setNftImages] = useState();
  const [erc20Images, setErc20Images] = useState();

  useEffect(() => {
    const fetchNftImages = async () => {
      console.log(order.erc721UnderlyingMetaInfo);
      const nftImages = await Promise.all(
        order.erc721UnderlyingMetaInfo.map(({ address, tokenId }) =>
          fetchWrapper.fetchNft(address, tokenId).then(({ image }) => image)
        )
      );

      setNftImages(nftImages);
    };

    fetchNftImages();
  }, [order]);

  return (
    <Container>
      <div className="image">
        {nftImages?.map((image, i) => (
          <img src={image} key={i} height={50} width={50} alt={"nft-image"} />
        ))}

        {order.erc20UnderlyingMetaInfo?.map(({ logoURI }, i) => (
          <img
            src={logoURI}
            key={i}
            height={50}
            width={50}
            alt={"erc20-image"}
          />
        ))}
      </div>

      <div className="assets-list">
        <div className="title">Assets</div>
        <div className="content">
          {order.erc721UnderlyingMetaInfo
            .map(({ name, symbol }) => `1 ${symbol || name}`)
            .concat(
              order.erc20UnderlyingMetaInfo.map(
                ({ symbol, amount }) => `${amount} ${symbol}`
              )
            )
            .map((txt, i) => (
              <div key={i}>{txt}</div>
            ))}
        </div>
      </div>

      <div className="meta-info">
        <div className="title">Strike Price</div>
        <div className="meta-text">{order.strike} ETH</div>
      </div>

      <div className="meta-info">
        <div className="title">Duration</div>
        <div className="meta-text">
          {Math.floor(order.duration / (24 * 60 * 60))} Days
        </div>
      </div>

      <div className="meta-info">
        <div className="title">Premium</div>
        <div className="meta-text">{order.premium} ETH</div>
      </div>
      <div className="meta-info">
        <div className="title">Creation</div>
        <div className="meta-text">
          {new Date(order.creationTimestamp || 0).toLocaleTimeString()}
        </div>
      </div>

      <div className="meta-info">
        <div className="title">Expires in</div>
        <div className="meta-text">
          {shortHumanizeDuration(order.expiration - new Date().getTime())}
        </div>
      </div>
    </Container>
  );
};
