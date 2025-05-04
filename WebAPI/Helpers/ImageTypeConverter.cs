using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI.Helpers
{
    public static class ImageTypeConverter
    {
        public static byte[] CovertImageStrToByte(string imgURL)
        {
            return Encoding.UTF8.GetBytes(imgURL);
        }
        public static string CovertImageByteToStr(byte[] img)
        {
            return Encoding.UTF8.GetString(img);
        }

    }
}