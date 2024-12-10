import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import { TypeCard } from "./TypeCard"
import Modal from "./Modal"

export function PokeCard(props){
    const {selectedPokemon} =props
    const [data,setData]=useState(null)
    const [loading,setLoding]=useState(false)
    const [skill,setSkill]=useState(null)
    const [loadingSkill,setLoadingSkill]=useState(false)

    const {name,height,abilities,stats,types,moves,sprites} = data || {}

    const imageList=Object.keys(sprites || {}).filter(val =>{
        if(!sprites[val]){ return false }  
        if(['versions','other'].includes(val)){ return false} 
        return true
    })

    async function fetchMoveData(move,moveUrl){
        if(loadingSkill || !localStorage || !moveUrl){ return }

        let c={}
        if(localStorage.getItem('pokemon-moves')){
            c=JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if(move in c){
            setSkill(c[move])
            console.log("Pokemon-move found in cache")
            return
        }

        try {
            setLoadingSkill(true)
            const res=await fetch(moveUrl)
            const moveData=await res.json()
            console.log("Fetch move from API",moveData)
            const description=moveData?.flavor_text_entries.filter
            (val =>{
                return val.version_group.name='firered-leafgreen'
            })[0]?.flavor_text
            
            const skillData={
                name:move,
                description
            }
            setSkill(skillData)
            c[move]=skillData
            localStorage.setItem('pokemon-moves',JSON.stringify(c))

        } catch (err) {
            console.log(err)
        }finally{
            setLoadingSkill(false)
        }
    }

    useEffect(() =>{
        //if loading exit
        if(loading || !localStorage){ return }

        //check if seleted pokemon data is available in chache 
        //1. define cache
        let cache={}
        if(localStorage.getItem('pokedex')){
            cache=JSON.parse(localStorage.getItem('pokedex'))
        }

        //2. check if available in chache or else call API
        if(selectedPokemon in cache){
            setData(cache[selectedPokemon])
            console.log("Pokemon data found in cache")
            return 
        }

        async function fetchPokemonData(){
            setLoding(true)
            try{
                const baseUrl='https://pokeapi.co/api/v2/'
                const suffix='pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl=baseUrl+suffix
                const res=await fetch(finalUrl)
                const pokemonData=await res.json()
                setData(pokemonData)
                console.log("Fetched Pokemon data from cache")
                cache[selectedPokemon]=pokemonData
                localStorage.setItem('pokedex',JSON.stringify(cache))
            }catch{
                console.log(err.message)
            }finally{
                setLoding(false)
            }
        }

        fetchPokemonData()

        //if we fetch from API the save data to cache
    },[selectedPokemon])

    if(loading || !data){
        return(
            <div>
                <h4>Loading....</h4>
            </div>
        )
    }
    
    return (
        <div className="poke-card">
            {(skill && <Modal handleCloseModal={() => { setSkill(null)}}>
                <div>
                    <h6>Name</h6>
                    <h2 className="skill-name">{skill.name.replaceAll('-',' ')}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>)}
            <div>
                <h1>#{getFullPokedexNumber(selectedPokemon)}</h1>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj,typeIndex) => {
                    return(
                        <TypeCard key={typeIndex} type={typeObj?.type?.name}/>
                    )
                })}
            </div>
            <img className="default-imgae" src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) +'.png'} alt={`${name}-large-icon`} />
            <div className='img-container'>
                {console.log(imageList)}
                {imageList.map((spriteUrl,spritIndex)=> {
                    const imageUrl=sprites[spriteUrl]
                    return (
                        <img key={spritIndex} src={imageUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                {stats.map((statObj,statIndex)=>{
                    const {stat,base_stat} =statObj
                    return (
                        <div key={statIndex} className="stat-item">
                            <p>{stat?.name.replaceAll('-',' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>

            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {moves.map((moveObj,moveIndex)=>{
                    return (
                        <button key={moveIndex} onClick={() => {
                            fetchMoveData(moveObj?.move?.name,moveObj?.move?.url)
                        }}>
                            <p>{moveObj?.move?.name.replaceAll('-',' ')}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}