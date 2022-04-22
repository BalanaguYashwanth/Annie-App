import { useState } from "react";
import {debounce} from 'lodash'
import { Link } from "react-router-dom";
import axios from 'axios'
var stack=[]
var score = 0
export function Home() {
  const [line1, setLine1] = useState(['q', 'w', 'e','r','t','y','u','i','o','p']);
  const [line2, setLine2] = useState(['a','s','d','f','g','h','j','k','l']);
  const [line3, setLine3] = useState(['z','x','c','v','b','n','M']);

  
  const [multiplier, setMultiplier] = useState(0)
  const [word, setWord] = useState('')
  const [saved, setSaved] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('rgb(232, 231, 231)')

  const [intro, setIntro] = useState(true)
  const [game, setGame] = useState(false)
  const [extro, setExtro] = useState(false)

  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState('')
 
  var arr=[]
  var updatedstack=''
  async function submit(obj)
  {
    if(obj!=='')
    {
    stack.push(obj)
    console.log(stack)
    setWord('')
    if(stack.length>=3)
    {
      for(let i=0;i<stack.length;i++)
      {
        if(!arr.includes(stack[i]))
        {
          await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/'+stack[i].split(' ').join(""))
          .then(res=>{
            console.log(res)
            score = score+10
            setMultiplier(multiplier+1)
            stack = stack.filter((s) => s!=stack[i])
          })
          .catch(err=>{
            setMultiplier(0)
            arr.push(stack[i])
          })
        }
      }
      
      if(stack.length==3)
      {
        await axios.post('https://particle-ae921-default-rtdb.firebaseio.com/datas.json',{
          name:name,
          score:score,
          level:multiplier
        })
        setIntro(false)
        setGame(false)
        setExtro(true)
      }
    }
  }else{
    setFeedback('Please Enter Valid Input')
  }
  }

  function named()
  {
    if(name!=='')
    {
      setIntro(false)
      setGame(true)
      setExtro(false)
    }
  }

  return (
    <div className="App">
    <div style={{textAlign:'center',position:'relative'}}>
    
   {intro && (<div>
      <h2> Enter your Name  {name &&  <span> : {name} </span> } </h2>
      <input style={{padding:10, borderRadius:5, border:'1px solid black'}}  onChange={ (e)=> setName(e.target.value) } placeholder='Enter your Name' />
      <br />
      <button style={{padding:2}} onClick={named} > submit </button>
    </div>)}

    { game && (  <div>
          <div style={{display:'flex'}}>
            <p className="trapezoid" > <span style={{fontSize:30, fontWeight:'bold', display:'block', }}>  {score} </span > <span style={{fontSize:10, fontWeight:'bold',display:'block'}}> SCORE </span>   </p>
            <p className="box" style={{position:'absolute',right:'5px', color:backgroundColor}}> <span style={{marginTop:100}} > {multiplier}X </span> </p>
          </div>
          <div style={{height:'2.8rem',background:backgroundColor}} className='custom'> {stack.map((s,index)=> (<span key={index} style={{ margin:2,background:'rgb(242, 240, 240)', paddingLeft:5, paddingRight:5 , borderRadius:3 ,border:'3px solid black', }}> {s} </span>) )}   { word &&  (<span style={{ background:'rgb(242, 240, 240)', paddingLeft:5, paddingRight:5 , margin:2, borderRadius:3 ,border:'3px solid black', }}> {word} </span>)  }   </div>
          {line1.map((character,index) => (
            <button key={index} className='custom' onClick={()=>{setWord(word+' '+character)}}>{character}</button>
          ))}
          <br /> 
          {line2.map((character,index) => (
            <button key={index} className='custom' onClick={()=>{setWord(word+' '+character)}}>{character}</button>
          ))}
          <br />
          {line3.map((character,index) => (
            <button key={index} className='custom' onClick={()=>{setWord(word+' '+character)}}>{character}</button>
          ))}
          <br />
          <button className='custom' onClick={()=>submit(word)} >enter</button>
            <p> {feedback} </p>
        </div> )}
          
        {extro && (<div>
          <h1> Game Over </h1>
          <Link to='/leaderboard'> My Leaderboard </Link>
      </div>
      )}
      
      </div>
      
    </div>
  );
}
