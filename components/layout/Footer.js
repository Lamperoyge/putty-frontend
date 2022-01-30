import styled from "styled-components";

const Container = styled.footer`
  display: grid;
  background-color: black;
  color: white;
  padding: 24px 48px;

  .socials {
    display: flex;
    a {
      margin-right: 12px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export const Footer = () => {
  return (
    <Container>
      <div className="socials">
        {[
          { link: "https://twitter.com/backspreadxyz", name: "Twitter" },
          { link: "https://discord.gg/2RUdbC9c", name: "Discord" },
          { link: "https://medium.com/@outdoteth", name: "Medium" },
        ].map(({ link, name }) => (
          <a target="_blank" rel="noreferrer" href={link} key={name}>
            {name}
          </a>
        ))}
      </div>
    </Container>
  );
};
