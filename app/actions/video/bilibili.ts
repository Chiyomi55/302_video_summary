import { logger } from "@/lib/logger";
import ky from "ky";

// Root Interface representing the entire JSON response
interface ApiResponse {
  code: number;
  message: string;
  ttl: number;
  data: Data;
}


interface Data {
  from: string;
  result: string;
  message: string;
  quality: number;
  format: string;
  timelength: number;
  accept_format: string;
  accept_description: string[];
  accept_quality: number[];
  video_codecid: number;
  seek_param: string;
  seek_type: string;
  durl: Durl[];
  support_formats: SupportFormat[];
  high_format: HighFormat | null;
  last_play_time: number;
  last_play_cid: number;
  view_info: ViewInfo | null;
}

// Durl Interface representing each item in the "durl" array
interface Durl {
  order: number;
  length: number;
  size: number;
  ahead: string;
  vhead: string;
  url: string;
  backup_url: string | null;
}

// SupportFormat Interface representing each item in the "support_formats" array
interface SupportFormat {
  quality: number;
  format: string;
  new_description: string;
  display_desc: string;
  superscript: string;
  codecs: string | null;
}

// HighFormat Interface (currently null, can be expanded if structure is known)
interface HighFormat {
  // Define properties if available
}

// ViewInfo Interface (currently null, can be expanded if structure is known)
interface ViewInfo {
  // Define properties if available
}
export const getRealUrlForBilibili = async (bid: string) => {
  try {
    const response = await ky
      .get(`https://abcd-biliapi.tools302.com/getvideo?bvid=${bid}`)
      .json<ApiResponse>();
    console.log("response", response)
    return response;
  } catch (error) {
    logger.error(error)
    throw new Error('Failed to get real URL for Bilibili')
  }
}
