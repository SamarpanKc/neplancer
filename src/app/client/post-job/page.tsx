export default function PostJobPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
      <div className="max-w-2xl mx-auto">
        <form className="space-y-6 p-6 bg-white shadow rounded-2xl">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input
              type="text"
              className="w-full border rounded-xl p-3"
              placeholder="e.g. Frontend Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              className="w-full border rounded-xl p-3"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              className="w-full border rounded-xl p-3"
              placeholder="e.g. Kathmandu, Remote"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Job Type</label>
            <select className="w-full border rounded-xl p-3">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Salary Range</label>
            <input
              type="text"
              className="w-full border rounded-xl p-3"
              placeholder="e.g. 30,000 - 60,000 NPR"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Job Description</label>
            <textarea
              rows={5}
              className="w-full border rounded-xl p-3"
              placeholder="Describe the role, responsibilities, and expectations"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Required Skills</label>
            <textarea
              rows={4}
              className="w-full border rounded-xl p-3"
              placeholder="List the key skills needed"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}
