import Image from "next/image"
import authImg from '@/assets/images/ai/auth-img.jpg'

const AuthImage = () => {
  return (
    <div className="hidden lg:block ps-4 py-4">
      <div className="relative rounded-xl overflow-hidden h-full w-full">
        <Image src={authImg} alt="auth" className="w-full h-full transform -scale-x-100" />
        <div className="absolute inset-0 bg-default-950/40">
          <div className="flex items-end justify-center h-full">
            <div className="p-6 text-start">
              <h5 className="text-xl font-bold text-white mb-3">Is the best way, <br /> to build your marketing strategy!</h5>
              <p className="text-base font-medium text-default-400">Try all paid functions for free. just register and create your first widget, it simple and fast.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default AuthImage