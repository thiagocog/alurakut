import React from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'


function ProfileSidebar({ user }) {
  return (
    <Box as='aside'>
      <img src={`https://github.com/${user}.png`} alt="Profile Image" style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a href={`https://github.com/${user}`} className='boxLink'>
          {user}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox({ items, title }) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title} ({items.length})
      </h2>
      <ul>
        {items.map((item, index) => {
          if (index < 6) return (
            <li key={item.id}>
              <a href={item.url}>
                <img src={item.avatar_url} />
                <span>{item.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}


function Home({ githubUser }) {
  const token = 'f9bf07eea4cc217e803075179a3871'
  // const githubUser = 'thiagocog'
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto', 
    'peas', 
    'rafaballerini', 
    'marcobrunodev',
    'felipefialho'
  ]
  const [comunidades, setComunidades] = React.useState([])
  const [seguidores, setSeguidores] = React.useState([])

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then(res => res.json())
    .then(resJson => setSeguidores(resJson))
    // .catch(error => console.log(error))

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            id,
            title,
            imageUrl,
            creatorSlug
          }
        }`
      })
    })
    .then(res => res.json())
    .then(resJson => {
      const allCommunities = resJson.data.allCommunities
      setComunidades(allCommunities)
    })
  }, [])
  
  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const comunidade = {
      title: formData.get('title'),
      imageUrl: formData.get('image'),
      creatorSlug: githubUser
    }
    fetch('/api/comunidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comunidade)
    }).then(async (response) => {
      const dados = await response.json()
      const comunidade = dados.record
      console.log(dados)
      setComunidades([...comunidades, comunidade])
    })
    
  }
  

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className='profileArea' style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar user={githubUser} />
        </div>
        <div className='welcomeArea' style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo</h1>
            <OrkutNostalgicIconSet
              fotos={32}
              recados={9}
              videos={6}
              fas={1}
              mensagens={78}
              confiavel={3}
            />
          </Box>
          <Box>
            <h2 className="subTitle">O que deseja fazer?</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="Qual será o nome da sua comunidade?"
                  aria-label="Qual será o nome da sua comunidade?"
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <input
                  type="url"
                  name="image"
                  placeholder="Insira uma URL para utilizar como capa?"
                  aria-label="Insira uma URL para utilizar como capa?"
                  required
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className='profileRelationsArea' style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map(item => (
                <li key={item.id}>
                  <a href={`/communities/${item.id}`}>
                    <img src={item.imageUrl} />
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.map(item => (
                <li key={item}>
                  <a href={`/users/${item}`}>
                    <img src={`https://github.com/${item}.png`} />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export default Home




export async function getServerSideProps(context) {
  const token = nookies.get(context).USER_TOKEN
  
  const res = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token,
    }
  })
  const { isAuthenticated } = await res.json()
  console.log(isAuthenticated)
  
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  
  const { githubUser } = jwt.decode(token)
  
  return {
    props: {
      githubUser
    }, // Will be passed to the page component as props
  }
}
