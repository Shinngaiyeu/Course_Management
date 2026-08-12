using System.IO;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IUploadService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, string folderName);
}
