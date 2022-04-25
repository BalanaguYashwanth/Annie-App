import { useEffect, useState } from "react";
import {debounce} from 'lodash'
import { Link } from "react-router-dom";
import axios from 'axios'
var stack=[]
var score = 0
var multiplier = 0
var arr=[]
export function Home() {
  const [line1, setLine1] = useState(['q', 'w', 'e','r','t','y','u','i','o','p']);
  const [line2, setLine2] = useState(['a','s','d','f','g','h','j','k','l']);
  const [line3, setLine3] = useState(['z','x','c','v','b','n','M']);

  const [apiCondition, setApiCondition] = useState(false)
  const [mainscore, setMainscore] = useState([])
  const [mainlevel, setMainlevel] = useState([])
  const [mainid, setMainid] = useState('')
  const [times, setTimes] = useState(0)

  const [word, setWord] = useState('')
  const [saved, setSaved] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('rgb(232, 231, 231)')

  const [intro, setIntro] = useState(true)
  const [game, setGame] = useState(false)
  const [extro, setExtro] = useState(false)

  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState('')
 
  
  var updatedstack=''

  useEffect(()=>{
    axios.get('https://particle-ae921-default-rtdb.firebaseio.com/datas.json')
    .then(res=>{
      let result = res.data
      for(let i in result)
      { 
        //console.log((result[i].name) ) 
        if((result[i].name).toLowerCase() === name.toLowerCase() )
        { 
          setApiCondition(true)
          setMainid('/'+i)
          setTimes(result[i].times)
          setMainscore(result[i].score)
          setMainlevel(result[i].level)
        }
      }
    })
    .catch(err=>console.log(err))
  },[name])


  async function submit(obj)
  {
    if(obj!=='')
    {
    stack.push(obj)
    setWord('')
    if(stack.length>=3)
    {
      for(let i=0;i<stack.length;i++)
      {
        if(!arr.includes(stack[i]))
        {
          await axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/'+stack[i].split(' ').join(""))
          .then(res=>{
            //console.log(res)
            score = score+10
            multiplier = multiplier+1
            stack = stack.filter((s) => s!=stack[i])
          })
          .catch(err=>{
            multiplier = 0
            arr.push(stack[i])
          })
        }
      }
      
      if(stack.length==3)
      {
        if(apiCondition)
        {
          await axios.put('https://particle-ae921-default-rtdb.firebaseio.com/datas'+mainid+'.json',{
            times:times+1,
            name:name,
            score:[...mainscore,score],
            level:[...mainlevel,multiplier]
          })
          setIntro(false)
          setGame(false)
          setExtro(true)
          setWord('')
          setApiCondition(false)
          stack=[]
          score=0
          multiplier = 0
        }else{
          await axios.post('https://particle-ae921-default-rtdb.firebaseio.com/datas'+mainid+'.json',{
            times:times+1,
            name:name,
            score:[...mainscore,score],
            level:[...mainlevel,multiplier]
          })
          setIntro(false)
          setGame(false)
          setExtro(true)
          setWord('')
          stack=[]
          score=0
          multiplier = 0
        }
      }
    }
  }else{
    
    setFeedback('Please Enter Valid Input')
    setTimeout(function(){
      setFeedback('')  
    },800)  
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