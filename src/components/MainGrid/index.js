import styled from "styled-components"

const MainGrid = styled.main`
  width: 100%;
  max-width: 500px;
  padding: 16px;
  grid-gap: 10px;
  margin: 0 auto;

  .profileArea {
    display: none;

    @media (min-width: 860px) {
      display: block;
    }
  }
  
  @media (min-width: 860px) {
    display: grid;
    grid-template-areas: 'profileArea welcomeArea profileRelationsArea';
    grid-template-columns: 160px 1fr 312px;
    max-width: 1110px;
  }
`

export default MainGrid