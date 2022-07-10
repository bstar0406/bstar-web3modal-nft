import { apis } from '../shared/config'
import DisplayBoard from '../components/DisplayBoard'
import { getDataAsync } from '../shared/service'
import Button from '@mui/material/Button'
import React, { CSSProperties } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import PulseLoader from 'react-spinners/PulseLoader'
import tokenABI from '../contract/token.json'
// import { TextField } from '@mui/material'

import { ethers } from 'ethers'
import Web3modal from 'web3modal'
import Eth from '../assets/images/eth.svg'
import USDC from '../assets/images/usdc.svg'
const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'yellow',
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function App() {
  const [data, setData] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const [color, setColor] = React.useState('#36D7B7')
  const [loading, setLoading] = React.useState(false)
  const [provider, setProvider] = React.useState<any>();
  const [library, setLibrary] = React.useState<any>();
  const [account, setAccount] = React.useState<any>();
  const [balance, setBalance] = React.useState<any>(0.0);
  const [usdc, setUsdc] = React.useState<any>(0.0);
  const [next, setNext] =  React.useState<string>('');
  const [previous, setPrevious] =  React.useState<string>('');
  const web3Modal = new Web3modal();
  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();

      if (accounts) setAccount(accounts[0]);
      (library as any).getBalance(accounts[0]).then((balance: any) => {
        const balanceInEth = ethers.utils.formatEther(balance)
        setBalance(balanceInEth)
      })
      const tokenContractAddress = '0x0882477e7895bdC5cea7cB1552ed914aB157Fe56';
      (window as any).provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
      );
      (window as any).signer = (window as any).provider.getSigner();
      (window as any).tokenContract = new ethers.Contract(
        tokenContractAddress,
        tokenABI,
        (window as any).signer,
      );
      // const userAddress = await library.getSigner().getAddress()
      // const usdcBalace = await (window as any).tokenContract.balanceOf('0x867D42C723523Fb2aA16EB603C499a5A25A31EbB')
      console.log((window as any).tokenContract)

      setUsdc(0.0)
      setProvider(provider);
      setLibrary(library);
    } catch (error) {
      console.error(error);
    }
  };
  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    setAccount(null)
    console.log(library)
  };
  React.useEffect(() => {
    setColor('#36D7B7')
    fetchData('')
  }, [])
  React.useEffect(() => {
    if ((library as any)?.on) {
      const handleAccountsChanged = (accounts: any) => {
        console.log(accounts)
        setAccount(accounts);
      };

      const handleDisconnect = async () => {
        // await web3Modal.clearCachedProvider();
        setAccount(null)
        console.log(library)
        console.log(account)
      };

      (library as any).on("accountsChanged", handleAccountsChanged);
      (library as any).on("disconnect", handleDisconnect);

      return () => {
        if ((library as any).removeListener) {
          (library as any).removeListener("accountsChanged", handleAccountsChanged);
          (library as any).removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [data, account, library, provider])
 
  const fetchData = async (url: any) => {
    setLoading(true)
    const tempData: any = await getDataAsync(apis.nft+url)
    setLoading(false)
    setData(tempData.assets)
    setNext(tempData.next)
    setPrevious(tempData.previous?tempData.previous:'')
    setSuccess(true)
    setOpen(true)
  }
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }
  return (
    <div className='app'>
      {loading && <div className="spinner d-flex justify-content-center align-items-center">
        <PulseLoader
          color={color}
          cssOverride={override}
          size={35}
          speedMultiplier={1.2}
        />
      </div>}
      <div className='intro-section px-3 py-3'>
        <div className='py-2 px-3 d-flex justify-content-end align-items-center'>
          <div className='white me-3'>{account ? account.toString().substring(0, 10) + "..." : 'Not connection'}</div>
          {!account && <Button className='connect-btn' onClick={() => connectWallet()}>Connect</Button>}
          {account && <Button className='connect-btn' onClick={() => disconnect()}>Disconnect</Button>}
        </div>
        {account && <>
          <div className='py-2 px-3 d-flex justify-content-end align-items-center'>
            <div className='white me-3'>{balance + " ETH"}</div>
            <img src={Eth} alt="eth" width={30} height={30} />
          </div>
          <div className='py-2 px-3 d-flex justify-content-end align-items-center'>
            <div className='white me-3'>{usdc + " USDC"}</div>
            <img src={USDC} alt="eth" width={30} height={30} />
          </div></>}
        <div className="d-flex justify-content-around mb-4 align-items-center">
        <Button className='connect-btn' onClick={() => fetchData(previous)}>Previous</Button>
            <Button className='connect-btn' onClick={() => fetchData(next)}>Next</Button>

        </div>
        <DisplayBoard data={data} />
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={success ? 'success' : 'warning'}
            sx={{ width: '100%' }}
          >
            {success ? 'Fetched Successfully!' : 'Failed'}
          </Alert>
        </Snackbar>
      </div>
    </div>
  )
}

export default App
