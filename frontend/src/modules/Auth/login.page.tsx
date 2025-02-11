import { LoginForm } from '@/components/login-form'

function LoginPage() {
  return (
    <>
    
    <div className='min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8'>
        <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">Field Works</h1>
     
          </div>
        </div>
      </div>

        <LoginForm />
    </>

  )
}

export default LoginPage
