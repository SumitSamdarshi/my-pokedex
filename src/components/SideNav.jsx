import { useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../utils"

export function SideNav(props){
    const {selectedPokemon,setSelectedPokemon,showSideMenu,handleSideMenu}=props
    const [searchValue,setSearchValue]=useState('')

    const filteredPokemonList=first151Pokemon.filter((ele,eleIndex) =>{
        if(getFullPokedexNumber(eleIndex).includes(searchValue)) { return true}

        if(ele.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())){ return true }

        return false
    })

    return(
        <nav className={' ' + (!showSideMenu ? ' open' : '')}>
            <div className={'header ' + (!showSideMenu ? ' open' : '')}>
                <button className="open-nav-button" onClick={handleSideMenu}>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className='text-gradient'>PokeDex</h1>
            </div>
            <input placeholder="Eg. 001 or Bulba.." value={searchValue} onChange={(e) =>{
                setSearchValue(e.target.value)
                console.log(searchValue)
            }}/>
            {filteredPokemonList.map((pokemon,pokemonIndex) =>{
                return(
                    <button key={pokemonIndex} className={'nav-card ' + (pokemonIndex===selectedPokemon ? 'nav-card-selected' : '')}
                    onClick={() => {
                        setSelectedPokemon(first151Pokemon.indexOf(pokemon))
                        handleSideMenu()
                    }}>
                        <p>{getFullPokedexNumber(first151Pokemon.indexOf(pokemon))}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}