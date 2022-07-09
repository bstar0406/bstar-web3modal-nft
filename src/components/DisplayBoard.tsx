
interface IPropsDisplayBoard {
  data: any
}

const DisplayBoard = ({ data }: IPropsDisplayBoard) => {

  return (
    <div className="d-flex flex-wrap justify-content-around">
      {data.map((item:any, index:number)=>{
        return <div className=' mb-4 card' key={index}>
          <div className='card-title d-flex justify-content-center align-items-center'>
            <div>{item.name}</div>
          </div>
          <div className="d-flex justify-content-center">
            <img src={item.image_url} alt='nft_image' width={278} height={300} />
          </div>
          {/* <div className='card-bottom d-flex justify-content-center align-items-center'>
            <div>{item.name}</div>
          </div> */}
        </div>
      })}
    </div>
  )
}

export default DisplayBoard;