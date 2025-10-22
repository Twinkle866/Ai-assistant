import { useState, useEffect } from 'react'

import Loading from './loading'
import { useAppContext } from '../context/AppContext'


const credits = () => {
  const { theme,token, axios } = useAppContext()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)


  const fetchPlans = async () => {
    try {
      const {data}=await axios.get('/api/credit/plan',{headers: { Authorization: `Bearer ${token}` }})
    if(data.success){
      setPlans(data.plans)
    }else{
      toast.error(data.message||'Failed to fetch plans.')
    }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const purchasePlan=async(planId)=>{
try {
  const {data}=await axios.post('/api/credit/purchase',{planId},{
    headers:{Authorization:`Bearer ${token}`}})
    if(data.success){
      window.location.href=data.url
    }else{
      toast.error(data.message)
    }
} catch (error) {
  toast.error(data.message)
}
  }
  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-transparent'>
      <h2 className={`text-3xl font-semibold text-center mb-10 xl:mt-30 transition-colors duration-200 ${
        theme === 'light' ? 'text-black' : 'text-white'
      }`}>
        Credit Plans
      </h2>

      <div className='flex flex-wrap justify-center gap-8'>
        {plans.map((plan) => (
          <div 
            key={plan._id} 
            className={`border rounded-lg shadow-md hover:shadow-xl
             transition-all duration-300 p-6 min-w-[300px] flex flex-col
             ${theme === 'light' 
               ? plan._id === "pro"
                 ? "border-purple-400 bg-gradient-to-br from-purple-500 to-purple-700"
                 : "border-gray-200 bg-white"
               : plan._id === "pro" 
                 ? "border-purple-500 bg-purple-900/40" 
                 : "border-gray-700 bg-gray-800/30"
             }`}
          >
            <div className='flex-1'>
              <h3 className={`text-xl font-bold mb-2 transition-colors duration-200 ${
                theme === 'light' 
                  ? plan._id === "pro" 
                    ? 'text-white' 
                    : 'text-gray-900'
                  : 'text-white'
              }`}>
                {plan.name}
              </h3>
              <p className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                theme === 'light' 
                  ? plan._id === "pro" 
                    ? 'text-white' 
                    : 'text-gray-900'
                  : 'text-purple-400'
              }`}>
                ${plan.price}
                <span className={`text-base font-normal transition-colors duration-200 ${
                  theme === 'light' 
                    ? plan._id === "pro" 
                      ? 'text-purple-100' 
                      : 'text-gray-700'
                    : 'text-gray-300'
                }`}>
                  {' '}/{plan.credits} credits
                </span>
              </p>
              <ul className={`list-disc list-inside text-sm font-medium space-y-1 transition-colors duration-200 ${
                theme === 'light' 
                  ? plan._id === "pro" 
                    ? 'text-purple-100' 
                    : 'text-gray-700'
                  : 'text-gray-300'
              }`}>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button onClick={()=>toast.promise(purchasePlan(plan._id),{loading:'Processing...'})}
            className='mt-6 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 
              dark:hover:bg-purple-600 active:bg-purple-800 dark:active:bg-purple-700
              text-white font-medium py-2 rounded transition-all duration-200 cursor-pointer
              shadow-sm hover:shadow-md'>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default credits