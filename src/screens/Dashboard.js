import axios from "axios";
import { useEffect, useState } from "react";


export default function Dashboard() {

 const [datas, setDatas] = useState('')

  useEffect(() => {
    axios
      .get("https://particle-ae921-default-rtdb.firebaseio.com/datas.json")
      .then((res) => {
          let result  =  []
          for(let obj in res.data)
          {
            result.push(res.data[obj])
          }
          result.sort((a,b)=> b.score - a.score)
          setDatas(result)
        })
      .catch((err) => console.log(err));
  }, []);


  function average(ar)
  { 
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let numCount = ar.length;
    let sum = ar.reduce(reducer);
    
    return parseInt(sum / numCount);
  }

  function max(score)
  {
    let updated = (score.sort((a,b) => (b - a)))[0]
    return updated
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}> LeaderBoard Dashboard </h2>
      <table style={{ width: "50%", margin: "auto" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>No. of Games Played</th>
            <th>Average Score</th>
            <th>Max Score</th>
            <th>Max Level</th>
          </tr>
        </thead>
        {
           datas && datas.map((r,index)=>(
                <tbody key={index} >
                <tr>
                  <td>{r.name.toUpperCase()}</td>
                  <td>{r.times}</td>
                  <td>{average(r.score)}</td>
                  <td>{max(r.score)}</td>
                  <td>{max(r.level)}</td>
                </tr>
              </tbody>
            ) )
        }
      </table>
    </div>
  );
}
