import { Job } from '@/types';
import Link from 'next/link';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-green-600">
          ${job.budget}
        </span>
        <Link
          href={`/jobs/${job.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
