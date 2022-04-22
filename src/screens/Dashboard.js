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
          //console.log(result)
        })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}> Dashboard </h2>
      <table style={{ width: "50%", margin: "auto" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Level</th>
          </tr>
        </thead>
        {
           datas && datas.map((r,index)=>(
                <tbody key={index} >
                <tr>
                  <td>{r.name}</td>
               
                  <td>{r.score}</td>
               
                  <td>{r.level}</td>
                </tr>
              </tbody>
            ) )
        }
      </table>
    </div>
  );
}
