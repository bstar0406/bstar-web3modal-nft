import React, { CSSProperties } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
interface IPropsDisplayBoard {
  data: any
}

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'yellow',
  position:'absolute',
  marginTop:'120px'
}
const initiateFlase:Array<boolean>=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]

const DisplayBoard = ({ data }: IPropsDisplayBoard) => {
  const [loaded, setLoaded] = React.useState<Array<boolean>>(initiateFlase);
  React.useEffect(()=>{
    let temp:Array<boolean>=loaded;
    for(var i=0;i<data.length;i++)
      temp[i] = false;
    setLoaded(temp)
  },[data])

  const changeLoadedState = (num:number) =>{
    let temp = loaded;
    if(temp!==undefined)temp[num] = true;
    setLoaded(temp)
  }
    
  return (
    <div className="d-flex flex-wrap justify-content-around">
      {data.map((item:any, index:number)=>{
        return <div className=' mb-4 card' key={index}>
          <div className='card-title d-flex justify-content-center align-items-center'>
            <div>{item.name?item.name:'No Title'}</div>
          </div>
          <div className="d-flex justify-content-center p-4">
            { !loaded[index] && item.image_url !==null &&
                <PulseLoader
                color={'#36D7B7'}
                cssOverride={override}
                size={15}
                speedMultiplier={1.0}
              />
              }
            <img  src={item.image_url?item.image_url:'../assets/images/default.png'} className='image-round' alt='nft_image' width={230} height={250} onLoad={()=>changeLoadedState(index)}/>
          </div>
        </div>
      })}
    </div>
  )
}

export default DisplayBoard;