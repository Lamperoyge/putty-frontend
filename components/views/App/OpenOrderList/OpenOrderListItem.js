import styled from "styled-components";

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
    width: 140px;
    height: fit-content;

    .content {
      font-weight: bold;
    }
  }

  .meta-info {
    width: 180px;
    height: 100%;
    max-height: 100px;
    display: grid;
  }

  .images {
    width: 100px;
  }
`;

export const OpenOrderListItem = ({ order }) => {
  return (
    <Container>
      <div className="images">
        <img src="/metamask.svg" alt="" height={50} width={50} />
      </div>

      <div className="assets-list">
        <div className="title">Assets</div>
        <div className="content">1 CryptoPunk, 87128 UNI</div>
      </div>

      <div className="meta-info">
        <div className="title">Strike Price</div>
        <div className="meta-text">{order.strike} ETH</div>
      </div>

      <div className="meta-info">
        <div className="title">Duration</div>
        <div className="meta-text">4656 Days</div>
      </div>

      <div className="meta-info">
        <div className="title">Premium</div>
        <div className="meta-text">{order.premium} ETH</div>
      </div>
      <div className="meta-info">
        <div className="title">Creation Date</div>
        <div className="meta-text">19/09 08:47</div>
      </div>

      <div className="meta-info">
        <div className="title">Expires in</div>
        <div className="meta-text">196d 4h 31m</div>
      </div>
    </Container>
  );
};
