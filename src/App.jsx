import { SideNav } from './components/SideNav'
import { PokeCard } from './components/PokeCard'
import { useState } from 'react'
import { Header } from './components/Header'

function App() {

  const [selectedPokemon,setSelectedPokemon]=useState(0)
  const [showSideMenu,setShowSideMenu]=useState(false)

  function handleSideMenu(){
    setShowSideMenu(!showSideMenu)
    console.log(showSideMenu)
  }

  return (
    <>
    <Header handleSideMenu={handleSideMenu}/>
    <SideNav selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} handleSideMenu={handleSideMenu} showSideMenu={showSideMenu}/>
    <PokeCard selectedPokemon={selectedPokemon} />
    </>
  )
}

export default App