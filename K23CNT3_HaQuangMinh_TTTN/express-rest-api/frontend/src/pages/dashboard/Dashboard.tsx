export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-500">
        Chào mừng bạn quay trở lại.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Học viên
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            1,250
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Khóa học
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            36
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Lớp học
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            84
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Doanh thu
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            1.2B
          </h2>
        </div>

      </div>
    </div>
  )
}